<template>
    <div class="register">
        <h1>Register</h1>
        <form @submit.prevent="registerUser">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" v-model="username" id="username" required />
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="email" id="email" required />
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="password" id="password" required />
            </div>
            <div class="form-group">
                <label for="phoneNumber">Phone Number:</label>
                <input type="text" v-model="phoneNumber" id="phoneNumber" required />
            </div>
            <button type="submit">Register</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "Register",
    data() {
        return {
            username: '',
            email: '',
            password: '',
            phoneNumber: '',
            errorMessage: '',
            successMessage: ''
        };
    },
    methods: {
        async registerUser() {
            try {
                const response = await axios.post("https://strapi-sever-ev.onrender.com/api/auth/local/register", {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                });
                this.successMessage = "Registration successful! Please log in.";
                this.errorMessage = '';
                this.username = '';
                this.email = '';
                this.password = '';
                this.phoneNumber = '';
                console.log(response.data.jwt)
            } catch (error) {
                this.errorMessage = "Registration failed. Please try again.";
                this.successMessage = '';
                console.error("Error during registration:", error.response.data);
            }
            console.log("Payload:", {
                username: this.username,
                email: this.email,
                password: this.password,
                phoneNumber: this.phoneNumber
            });

        }

    }
};
</script>

<style scoped>
.register {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

h1 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background-color: #0056b3;
}

.error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 1rem;
}

.success-message {
    color: #2ecc71;
    text-align: center;
    margin-top: 1rem;
}
</style>