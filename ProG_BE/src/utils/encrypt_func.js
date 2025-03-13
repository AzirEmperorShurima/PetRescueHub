import { encrypt } from "./crypto_js";
export const encryptData = (data, encrypt) => {
    if (typeof data === 'object' && data !== null) {
        const result = Array.isArray(data) ? [] : {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'object' && data[key] !== null) {
                    result[key] = encryptData(data[key], encrypt);
                } else {

                    result[key] = encrypt(data[key]);
                }
            }
        }
        return result;
    } else {

        return encrypt(data);
    }
}


// Sử dụng
const obj = {
    name: 'John Doe',
    age: 30,
    details: {
        email: 'johndoe@example.com',
        address: {
            city: 'New York',
            zip: '10001'
        }
    },
    hobbies: ['reading', 'travelling']
};

const encryptedObj = encryptData(obj, encrypt);
console.log(encryptedObj);
