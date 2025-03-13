/** @jsx h */
import { h, ref } from 'vue';
import { defineComponent } from 'vue';

const Login = defineComponent({
    name: 'Login',
    setup() {
        const username = ref('');
        const password = ref('');

        const handleSubmit = (event) => {
            event.preventDefault();
            // Handle login logic here
            console.log('Username:', username.value);
            console.log('Password:', password.value);
        };

        return () => (
            <div class="flex items-center justify-center min-h-screen bg-gray-100 w-full">
                <div class="w-full max-w-xs">
                    <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
                    <form onSubmit={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                v-model={username.value}
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                v-model={password.value}
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <button
                                type="submit"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

export default Login;
// import { useState } from 'react';

// function LOGIN(props) {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleUsernameChange = (event) => {
//         setUsername(event.target.value);
//     }

//     const handlePasswordChange = (event) => {
//         setPassword(event.target.value);
//     }

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         console.log('Submit')
//     }

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="w-full max-w-xs">
//                 <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//                 <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             id="username"
//                             value={username}
//                             onChange={handleUsernameChange}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={handlePasswordChange}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                             required
//                         />
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <button
//                             type="submit"
//                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         >
//                             Login
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default LOGIN;
