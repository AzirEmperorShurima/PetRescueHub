import { decrypt } from "./crypto_js";

export const decryptData = (data, decrypt) => {
    if (typeof data === 'object' && data !== null) {
        const result = Array.isArray(data) ? [] : {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'object' && data[key] !== null) {

                    result[key] = decrypt(data[key], decrypt);
                } else {

                    result[key] = decrypt(data[key]);
                }
            }
        }
        return result;
    } else {

        return decrypt(data);
    }
}



const encryptedObj = {
    name: "Sm9obiBEb2U=",
    age: 30,
    details: {
        email: "am9obmRvZUBleGFtcGxlLmNvbQ==",
        address: {
            city: "TmV3IFlvcms=",
            zip: "MTAwMDE="
        }
    },
    hobbies: ["cmVhZGluZw==", "dHJhdmVsbGluZw=="]
};

const decryptedObj = decryptData(encryptedObj, decrypt);
console.log(decryptedObj);
