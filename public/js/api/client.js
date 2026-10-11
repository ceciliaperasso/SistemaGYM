const BASE_URL = 'http://localhost:3000';
async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, options);
    if (!response.ok) {
        const { mensaje } = await response.json();
        throw new Error(mensaje);
    }
    return response.json();
}

export default request;