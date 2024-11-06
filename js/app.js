document.addEventListener('DOMContentLoaded', function () {
    // Constanten en variabelen
    const correctCodes = {
        '6666': 'Bart',
        '3333': 'Goisa',
        '5555': 'Technische Dienst',
        '7777': 'Kantoor'
    };

    let pinValue = '';
    let loggedInUser = null;

    // DOM-elementen
    const pinInput = document.getElementById('pin');
    const errorMessage = document.getElementById('error-message');
    const userDisplay = document.getElementById('user-display');
    const welcomeUser = document.getElementById('welcome-user');
    const submitQualityControlButton = document.getElementById('submit-quality-control');
    const dateTimeInput = document.getElementById('date-time');
    const employeeNameInput = document.getElementById('employee-name');
    const machineNameSpan = document.getElementById('machine-name');
    const uniqueCodeSpan = document.getElementById('unique-code');
    const productNumberInput = document.getElementById('product-number');
    const currentWeightInput = document.getElementById('current-weight');
    const controlWeightInput = document.getElementById('control-weight');
    const commentsInput = document.getElementById('comments');
    const resultSelect = document.getElementById('result');
    const palletGoodCheckbox = document.getElementById('pallet-good');
    const labelGoodCheckbox = document.getElementById('label-good');
    const octobinStickerCheckbox = document.getElementById('octobin-sticker');
    const productPhotoInput = document.getElementById('product-photo');
    const productCodeInput = document.getElementById('product-code');
    const photoInput = document.getElementById('product-photo');
    const argumentationInput = document.getElementById('argumentation');
    const solutionRadios = document.getElementsByName('solution');
    const submitProblemButton = document.getElementById('submit-problem');

    // Hulpfuncties
    function getLoggedInUsername() {
        return loggedInUser;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        console.log(`Foutmelding getoond: ${message}`);
    }

    function hideError() {
        errorMessage.style.display = 'none';
        console.log("Foutmelding verborgen");
    }

    function generateUniqueCode() {
        return 'MC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    function navigateToSection(sectionId) {
        console.log(`Proberen te navigeren naar sectie: ${sectionId}`);

        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
            console.log(`Sectie ${section.id} verborgen.`);
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            console.log(`Succesvol genavigeerd naar sectie: ${sectionId}`);
            updateButtons(sectionId);
        } else {
            console.error(`Sectie met ID '${sectionId}' niet gevonden`);
            alert(`Fout: De sectie '${sectionId}' bestaat niet.`);
        }
    }

    function updateButtons(sectionId) {
        const backButton = document.querySelector('.back-button');
        const logoutButton = document.querySelector('.logout-button');

        switch (sectionId) {
            case 'login-section':
                backButton.style.display = 'none';
                logoutButton.style.display = 'none';
                break;
            case 'welcome-section':
                backButton.style.display = 'none';
                logoutButton.style.display = 'inline-block';
                break;
            case 'machine-selection-section':
            case 'report-problem-section':
            case 'form-section':
                backButton.style.display = 'inline-block';
                logoutButton.style.display = 'inline-block';
                break;
            case 'confirmation-section':
                backButton.style.display = 'none';
                logoutButton.style.display = 'none';
                break;
            default:
                backButton.style.display = 'none';
                logoutButton.style.display = 'none';
                break;
        }
    }

    function goBack() {
        const currentSection = document.querySelector('.section:not(.hidden)');
        if (!currentSection) return;

        switch (currentSection.id) {
            case 'welcome-section':
                navigateToSection('login-section');
                console.log("Terug naar login-pagina vanaf welkomstpagina.");
                break;
            case 'machine-selection-section':
            case 'report-problem-section':
                navigateToSection('welcome-section');
                console.log("Terug naar welkomstpagina vanaf machine-selectie of probleem melden.");
                break;
            case 'form-section':
                navigateToSection('machine-selection-section');
                console.log("Terug naar machine-selectiepagina vanaf kwaliteitscontrole formulier.");
                break;
            case 'confirmation-section':
                navigateToSection('welcome-section');
                console.log("Terug naar login-pagina vanaf bevestigingspagina.");
                break;
            default:
                console.log("Geen terugactie gedefinieerd voor deze sectie.");
                break;
        }
    }

    function logout() {
        clearFormData();
        navigateToSection('login-section');
        resetApp();
        localStorage.clear();
        sessionStorage.clear();
        console.log("Uitgelogd, formuliergegevens gewist, en terug naar inlogpagina");
    }

    function clearFormData() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.reset();
        });
    }

    function resetApp() {
        pinValue = '';
        pinInput.value = '';
        loggedInUser = null;
        userDisplay.textContent = '';
        welcomeUser.textContent = '';
        hideError();
        document.getElementById('error-message').style.display = 'none';
    }

    function prepareFormAndNavigate(machineName) {
        const uniqueCode = generateUniqueCode();
        sessionStorage.setItem('selectedMachine', machineName);
        sessionStorage.setItem('uniqueCode', uniqueCode);

        navigateToSection('form-section');
        document.getElementById('machine-name').textContent = machineName;
        document.getElementById('unique-code').textContent = uniqueCode;
    }

    // Verbeterde toBase64 functie met error handling
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('Geen bestand opgegeven'));
                return;
            }

            // Check bestandsgrootte (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                reject(new Error('Bestand is te groot (max 5MB)'));
                return;
            }

            // Check bestandstype
            if (!file.type.startsWith('image/')) {
                reject(new Error('Alleen afbeeldingsbestanden zijn toegestaan'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Enkele verbeterde sendFormData functie
    async function sendFormData(formData) {
        console.log("Start verzenden formulierdata");

        try {
            // Maak een object voor alle form data
            const dataToSend = { ...formData };
            delete dataToSend.photo; // Verwijder photo property tijdelijk

            // Functie om een file naar base64 te converteren
            const getBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            };

            // Voeg de foto toe als base64 string
            if (formData.formType === 'kwaliteitscontrole' && productPhotoInput.files[0]) {
                const base64Photo = await getBase64(productPhotoInput.files[0]);
                dataToSend.photo = base64Photo;
            } else if (formData.formType === 'probleem' && photoInput.files[0]) {
                const base64Photo = await getBase64(photoInput.files[0]);
                dataToSend.photo = base64Photo;
            }

            console.log("Verzenden van formulier data:", dataToSend);

            const response = await fetch("https://script.google.com/macros/s/AKfycbxyK4l7LjtdOlRrxTWfEkINjGbaR17piPcLwGO5rY12uoMa2z_AzoIHqTBFJlhKdYOKyg/exec", {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            console.log("Formulier succesvol verzonden");
            alert("Formulier succesvol verzonden naar Google Sheet");
            navigateToSection('confirmation-section');

        } catch (error) {
            console.error("Fout bij het verzenden van het formulier:", error);
            alert(`Er is een fout opgetreden bij het verzenden van het formulier: ${error.message}`);
        }
    }

    function validateQualityControlForm() {
        const requiredFields = {
            'date-time': 'Datum en tijd',
            'employee-name': 'Medewerker naam',
            'product-number': 'Productnummer',
            'current-weight': 'Huidig gewicht',
            'control-weight': 'Controle gewicht'
        };

        for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                alert(`${fieldName} is verplicht.`);
                return false;
            }
        }
        return true;
    }

    // Event Listeners
    document.getElementById('submit-code').addEventListener('click', function () {
        pinValue = pinInput.value.trim();

        if (pinValue.length >= 4 && pinValue.length <= 8 && correctCodes[pinValue]) {
            hideError();
            loggedInUser = correctCodes[pinValue];
            welcomeUser.textContent = loggedInUser;
            navigateToSection('welcome-section');
            pinInput.value = '';
        } else {
            showError("Ongeldige code. Voer een geldige pincode in (4-8 cijfers).");
            pinInput.value = '';
        }
    });

    document.getElementById('backspace-button').addEventListener('click', function () {
        pinValue = pinValue.slice(0, -1);
        pinInput.value = pinValue;
        console.log("Backspace gebruikt, huidige pinValue:", pinValue);
    });

    document.getElementById('continue-to-machines-button').addEventListener('click', function () {
        userDisplay.textContent = `Ingelogd als ${loggedInUser}`;
        navigateToSection('machine-selection-section');
        console.log("Doorgaan naar Machine Selectie");
    });

    document.querySelectorAll('.machine-button').forEach(button => {
        button.addEventListener('click', function () {
            const machineName = this.textContent;
            prepareFormAndNavigate(machineName);
        });
    });

    document.getElementById('report-problem-button').addEventListener('click', function () {
        navigateToSection('report-problem-section');
        console.log("Navigeren naar Probleem Melden Verpakking");
    });

    document.getElementById('logout-button').addEventListener('click', function () {
        navigateToSection('login-section');
        resetApp();
        console.log("Uitgelogd en terug naar inlogpagina");
    });

    submitQualityControlButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!validateQualityControlForm()) {
            return;
        }

        const formData = {
            formType: 'kwaliteitscontrole',
            datumEnTijd: dateTimeInput.value,
            medewerker: employeeNameInput.value,
            machineName: machineNameSpan.textContent,
            uniqueCode: uniqueCodeSpan.textContent,
            productnummer: productNumberInput.value,
            huidigGewicht: currentWeightInput.value,
            controleGewicht: controlWeightInput.value,
            opmerkingen: commentsInput.value,
            voldoetAanEisen: resultSelect.value,
            palletGoed: palletGoodCheckbox.checked,
            etiketGoed: labelGoodCheckbox.checked,
            stickerOpOctobin: octobinStickerCheckbox.checked
        };

        await sendFormData(formData);
    });

    submitProblemButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!productCodeInput.value.trim()) {
            alert("Productcode is verplicht.");
            return;
        }

        if (!photoInput.files.length) {
            alert("Upload minstens één foto.");
            return;
        }

        try {
            const formData = {
                formType: 'probleem',
                datumEnTijd: new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' }),
                gebruikersnaam: loggedInUser,
                productcode: productCodeInput.value.trim(),
                argumentatie: argumentationInput.value.trim()
            };

            // Verwerk oplossing
            let solutionFound = Array.from(solutionRadios).find(radio => radio.checked)?.value;
            if (!solutionFound) {
                alert("Selecteer 'Oplossing gevonden?' (Ja/Nee).");
                return;
            }

            formData.oplossingGevonden = solutionFound;
            if (solutionFound === "yes") {
                const solutionComment = prompt("Voer opmerkingen in over de oplossing:");
                if (!solutionComment?.trim()) {
                    alert("Opmerking is verplicht wanneer 'Oplossing gevonden' is geselecteerd.");
                    return;
                }
                formData.oplossingOpmerkingen = solutionComment;
            }

            await sendFormData(formData);

        } catch (error) {
            console.error("Fout bij het verwerken van het formulier:", error);
            alert(`Er is een fout opgetreden: ${error.message}`);
        }
    });

    // Initiële setup
    navigateToSection('login-section');
});