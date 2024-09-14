// Object to store patient data with phone number as the unique identifier
let patientData = {};
let currentStep = 0;
let flag = 0;
let patientInfo = {
    name: "",
    age: "",
    symptoms: "",
    doctorSpecialization: "",
    appointmentDate: "",
    appointmentTime: "",
    phoneNumber: ""
};

// Function to simulate chat responses based on the FAQ
function respondToMessage(message, phoneNumber = null) {
    let response = "";

    // Convert message to lowercase to handle case-insensitivity
    message = message.toLowerCase();

    // Predefined responses using if-else
    if (message.includes("hi") || message.includes("hello") || message.includes("restart") || message.includes("reset")) {
        flag = 0;
        response = "Hello there! How may I assist you? Do you want Details or Book Appointment?";
    }
    else if(message.includes("detail") || flag === 1) {
        flag = 1;
        if (message.includes("details") || message.includes("detail")) {
            response = "Choose: Facilities, Doctors, Departments, Services, Slot Availability";
        } else if (message.includes("facilities")) {
            response = "We offer state-of-the-art medical facilities including advanced operation theaters, intensive care units, and modern patient rooms.";
        } else if (message.includes("doctor")) {
            response = "We have a panel of highly qualified doctors in various specialties like Cardiology, Neurology, Orthopedics, and more.";
        } else if (message.includes("department")) {
            response = "Our available departments include General Medicine, Pediatrics, Cardiology, Neurology, Orthopedics, and Dermatology.";
        } else if (message.includes("service")) {
            response = "Our services include Dialysis, ECG, X-ray, MRI, Ultrasound, and more specialized treatments.";
        } else if (message.includes("slot availability") || message.includes("slot") || message.includes("availability")) {
            response = "Slots are available from 9 AM to 6 PM, Monday to Saturday. Enter 'Book' to book your slot";
        }
    } else if (message.includes("book appointment") || message.includes("appointment") || message.includes("book") || flag === 2 || flag === 1) {
        flag = 2;
        if (message.includes("book") || message.includes("book appointment") || message.includes("appointment")) {
            response = "Please enter your name."
        } else if (currentStep === 0) {
            if (message.includes("name")) {
                patientInfo.name = message.replace("My name is", "").trim();
                response = `Hello ${patientInfo.name}! How old are you?`;
                currentStep = 1;
            } else {
                patientInfo.name = message;
                response = `Hello ${patientInfo.name}! How old are you?`;
                currentStep = 1;
            }
        } else if (currentStep === 1) {
            patientInfo.age = message.replace(/\D/g, "").trim(); // Extracts age (numeric input)
            if (patientInfo.age) {
                response = "Please describe your symptoms.";
                currentStep = 2;
            } else {
                response = "Please provide a valid age.";
            }
        } else if (currentStep === 2) {
            patientInfo.symptoms = message.trim();
            response = "Which doctor's specialization do you need (e.g., General Physician, Cardiologist,Nuerologist, Dermatologist)?";
            currentStep = 3;
        } else if (currentStep === 3) {
            if (message.toLowerCase().includes("general") || message.includes("physician") || message.toLowerCase().includes("cardiologist") || message.toLowerCase().includes("dermatologist")) {
                patientInfo.doctorSpecialization = message.trim();
                response = "What date would you like to book the appointment? (e.g., 20/09/2014)";
                currentStep = 4;
            } else {
                response = "Please provide a valid doctor's specialization (General Physician, Cardiologist, Dermatologist).";
            }
        } else if (currentStep === 4) {
            patientInfo.appointmentDate = message.trim(); // Date format validation can be added
            response = "What time would you prefer? (e.g. 3:00 PM)";
            currentStep = 5;
        } else if (currentStep === 5) {
            patientInfo.appointmentTime = message.trim(); // Time format validation can be added
            response = "Please provide your phone number to confirm the appointment.";
            currentStep = 6;
        } else if (currentStep === 6) {
            patientInfo.phoneNumber = message.trim(); // Phone number validation can be added
            response = `Appointment booked for ${patientInfo.name} with a ${patientInfo.doctorSpecialization} on ${patientInfo.appointmentDate} at ${patientInfo.appointmentTime}. We will contact you at ${patientInfo.phoneNumber}. Please take a screnshot of this message.`;
            patientData[patientInfo.phoneNumber] = { ...patientInfo, booked: true };
            currentStep = 0; // Reset for next booking
        } else if (message.includes("book slot") && !patientInfo.phoneNumber) {
            response = "Please provide your phone number to book a slot.";
        } else if (patientInfo.phoneNumber && message.includes("book slot")) {
            response = `Slot booked for patient with phone number ${patientInfo.phoneNumber}. Thank you!`;
            patientData[patientInfo.phoneNumber] = { booked: true };
        } else {
            response = "I'm sorry, I don't understand that question. Could you try asking something else?";
        }
    } else {
        flag = 0;
        response = "I'm sorry, I don't understand that question. Do you want Details or Book Appointment?";
    }

    return response;
}

// Function to append a message to the chat box
function appendMessage(message, messageType) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', messageType);

    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);

    chatBox.appendChild(messageDiv);

    // Scroll to the bottom of the chat box when a new message is added
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Variable to track phone number entry
let phoneNumber = null;

// Handle user input
document.getElementById('send-button').addEventListener('click', () => {
    const chatInput = document.getElementById('chat-input');
    const userMessage = chatInput.value.trim();

    if (userMessage) {
        // Append the user's message to the chat box
        appendMessage(userMessage, 'sent');

        // If phone number is expected, capture it
        // if (!phoneNumber && userMessage.match(/^[0-9]{10}$/)) {
        //     phoneNumber = userMessage;
        //     appendMessage(`Phone number ${phoneNumber} received. Now you can book a slot.`, 'received');
        // } else {
            // Get a response to the user's message
            const botResponse = respondToMessage(userMessage, phoneNumber);

            // Simulate a delay before the bot responds
            setTimeout(() => {
                appendMessage(botResponse, 'received');
            }, 500);

            // Clear the chat input after sending
            chatInput.value = '';
        // }
    }
});

// Optionally, handle the Enter key press to send a message
document.getElementById('chat-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});
