export function validateEmail(email) {   //para validar que el email tenga un formato valido y no sea vacio
    const emailRegex=/\S+@\S+\.\S+/;  // regex sencillo de validacion de email
    if (email === undefined || email.trim() === '') {
        return 'Este campo es obligatorio'
    } else if (!emailRegex.test(email)) {
        return 'Correo electrónico inválido'
    } else { 
        return '';
    }
}
export function validatePassword(password) { //para validar que la contraseña tenga un formato valido y no sea vacio
    const passwordRegex=/\S{6,}/;     // regex sencillo de validacion de contraseña, mayor a 6 caracteres
    if (password === undefined || password.trim() === '') {
        return 'Este campo es obligatorio'
    } else if (!passwordRegex.test(password)) {
        return 'La contraseña debe tener al menos 6 caracteres'
    } else {
        return '';
    }   
}
export function validateNotEmpty(input) {  //para validar que un input no sea vacio
    if (typeof input === 'number') { //para validar inputs en forma de numeros
        return ''
    } else if (input === undefined || input.trim() === '') { //para validar inputs en forma de strings
        return 'Este campo es obligatorio'
    } else {
        return ''
    }
}