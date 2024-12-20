document.addEventListener('DOMContentLoaded', function () {
    // Constanten en variabelen
    const correctCodes = {
        '6666': 'Bart',
        '3333': 'Goisa',
        '5555': 'Technische Dienst',
        '7777': 'Kantoor',
        'K1999': 'Admin'

    };
// ➕ NIEUW: Voeg deze nieuwe functie toe na Thomas
function isAdmin() {
    return loggedInUser === 'Admin';
}

// ➕ NIEUW: Voeg deze nieuwe functie toe na Thomas
function updateSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.display = isAdmin() ? 'block' : 'none';
    }
}

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

// nieuw toegevoegd na Thomas 
    // Page selector 
     // Event listeners voor de pagina selector knoppen
     const navButtons = document.querySelectorAll('.nav-button');
    
     navButtons.forEach(button => {
         button.addEventListener('click', function() {
             const targetSection = this.getAttribute('data-section');
             
             // Controleer of gebruiker is ingelogd voor bepaalde secties
             if (!loggedInUser && 
                 ['welcome-section', 'machine-selection-section', 
                  'report-problem-section', 'form-section'].includes(targetSection)) {
                 alert('U moet eerst inloggen om deze pagina te bekijken.');
                 navigateToSection('login-section');
                 return;
             }
             
             // Update actieve status van knoppen
             navButtons.forEach(btn => btn.classList.remove('active'));
             this.classList.add('active');
             
             // Navigeer naar de geselecteerde sectie
             navigateToSection(targetSection);
         });
     });


         // Selecteer alle terug- en uitlogknoppen
    const backButtons = document.querySelectorAll('.back-button');
    const logoutButtons = document.querySelectorAll('.logout-button');
    
    // Event listeners voor alle terugknoppen
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.section:not(.hidden)');
            if (currentSection) {
                switch (currentSection.id) {
                    case 'welcome-section':
                        navigateToSection('login-section');
                        break;
                    case 'machine-selection-section':
                        navigateToSection('welcome-section');
                        break;
                    case 'report-problem-section':
                        navigateToSection('welcome-section');
                        break;
                    case 'form-section':
                        navigateToSection('machine-selection-section');
                        break;
                    case 'confirmation-section':
                        navigateToSection('welcome-section');
                        break;
                    default:
                        navigateToSection('welcome-section');
                }
            }
        });
    });

    // Event listeners voor alle uitlogknoppen
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const shouldLogout = confirm('Weet u zeker dat u wilt uitloggen?');
            if (shouldLogout) {
                // Reset alle formulierdata
                const forms = document.querySelectorAll('form');
                forms.forEach(form => form.reset());
                
                // Reset gebruikersgegevens
                loggedInUser = null;
                document.getElementById('welcome-user').textContent = '';
                document.getElementById('user-display').textContent = '';
                
                // Verwijder eventuele error messages
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
                
                // Ga terug naar login pagina
                navigateToSection('login-section');
                
                // Clear storage
                localStorage.clear();
                sessionStorage.clear();
            }
        });
    });

    // Update de zichtbaarheid van de knoppen bij sectie wissel
    function updateButtonVisibility(sectionId) {
        // Verberg eerst alle navigatieknoppen
        document.querySelectorAll('.back-button, .logout-button').forEach(button => {
            button.style.display = 'none';
        });

        // Toon de juiste knoppen gebaseerd op de huidige sectie
        const currentSection = document.getElementById(sectionId);
        if (currentSection) {
            const navButtons = currentSection.querySelectorAll('.back-button, .logout-button');
            navButtons.forEach(button => {
                button.style.display = 'block';
            });
        }
    }

    // Voeg de updateButtonVisibility toe aan je bestaande navigateToSection functie
    const originalNavigateToSection = navigateToSection;
    navigateToSection = function(sectionId) {
        originalNavigateToSection(sectionId);
        updateButtonVisibility(sectionId);
    };


    //Helpers voor loading
    function showLoading(message = 'Formulier wordt verzonden...') {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    //nieuw toegevoegd hierboven! Thomas!!




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
            updateSidebarVisibility();//na thomas toegevoegd
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
        updateSidebarVisibility(); //toegevoegd na Thomas
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
            alert("Formulier succesvol verzonden!");
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
            updateSidebarVisibility();//na thomas toegevoegd
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

   // Je kwaliteitscontrole submit handler
submitQualityControlButton.addEventListener('click', async function (e) {
    e.preventDefault();

    if (!validateQualityControlForm()) {
        return;
    }

    try {
        showLoading('Kwaliteitscontrole wordt verwerkt...');

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
            etiketGood: labelGoodCheckbox.checked,
            stickerOpOctobin: octobinStickerCheckbox.checked
        };

        // Simuleer een korte vertraging voor UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        await sendFormData(formData);
        
        hideLoading();
        navigateToSection('confirmation-section');

    } catch (error) {
        hideLoading();
        console.error("Fout bij het verzenden van het formulier:", error);
        alert(`Er is een fout opgetreden: ${error.message}`);
    }
}); // Einde van submitQualityControlButton event listener


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

            //na de thomas aanpassingen 
            showLoading('Probleem wordt gemeld...');

            const formData = {
                formType: 'probleem',
                datumEnTijd: dateTimeInput.value,
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
            // Na thomas toegevoegd Simuleer een korte vertraging voor UX
        await new Promise(resolve => setTimeout(resolve, 1500));

            await sendFormData(formData);

            //toegevoegd na thomas 
            // Navigeer naar de bevestigingspagina
            hideLoading();
        navigateToSection('confirmation-section');

        //hierboven toegevoegd na Thomas

        } catch (error) {
            console.error("Fout bij het verwerken van het formulier:", error);
            alert(`Er is een fout opgetreden: ${error.message}`);
        }
    });

    // Initiële setup
    navigateToSection('login-section');
});