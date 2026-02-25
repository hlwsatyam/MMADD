const mongoose = require('mongoose');
const User = require('./models/User'); // apna correct path lagana

// MongoDB connect
mongoose.connect("mongodb+srv://HeySatyam:20172522Satyam@cluster0.xqoozjj.mongodb.net/ttt?retryWrites=true&w=majority&appName=Cluster0");

function getRandomBoolean() {
    return Math.random() < 0.5;
}

function getRandomMobile() {
    return '9' + Math.floor(100000000 + Math.random() * 900000000);
}

function getRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function insertRandomUsers() {
    try {
        for (let i = 0; i < 100; i++) {

            const user = new User({
                email: `user${Date.now()}${i}@gmail.com`,
                firstName: getRandomString(6),
                lastName: getRandomString(6),
                mobileNumber: getRandomMobile(),
                address: "Random Address",
                pincode: "132001",
                state: "Haryana",
                city: "Karnal",
                village: "Shamgarh",
                caste: "General",
                profileCompleted: true,
                lookingForJob: getRandomBoolean(),
                canProvideJob: getRandomBoolean()
            });

            await user.save();
            console.log(`User ${i + 1} inserted`);
        }

        console.log("✅ 100 Random Users Inserted Successfully");
        mongoose.connection.close();

    } catch (error) {
        console.error("Error inserting users:", error);
    }
}

 insertRandomUsers();