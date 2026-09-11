'use server'

import {prisma} from "@/lib/prisma";
import {hashPassword} from "@/lib/password";
import {createSession} from "@/lib/session";
import {redirect} from "next/navigation";
import {LOGIN_RE, FULL_NAME_RE, PHONE_RE, EMAIL_RE} from "@/lib/validation";

export interface RegisterState {
    fieldErrors?: Record<string, string>
}



export async function register(
    _prevState: RegisterState,
    formData: FormData,
) {
    const login = String(formData.get('login') ?? '')
    const password = String(formData.get('password') ?? '')
    const fullName = String(formData.get('fullName') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const email = String(formData.get('email') ?? '')

    const fieldErrors: Record<string, string> = {}
    if (!LOGIN_RE.test(login)) {
        fieldErrors.login = 'Логин должен содержать только латинские буквы и цифры, не менее 6 символов'
    }
    if (password.length < 8) {
        fieldErrors.password = 'Пароль должен содержать не менее 8 символов'
    }
    if (!FULL_NAME_RE.test(fullName)) {
        fieldErrors.fullName = 'ФИО должно содержать только кириллицу и пробелы'
    }
    if (!PHONE_RE.test(phone)) {
        fieldErrors.phone = 'Телефон должен быть в формате 8(XXX)XXX-XX-XX'
    }
    if (!EMAIL_RE.test(email)) {
        fieldErrors.email = 'Некорректный адрес электронной почты'
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors }
    }

    const existing = await prisma.user.findUnique({ where: { login } })
    if (existing) {
        return { fieldErrors: { login: 'Логин занят' } }
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
        data: { login, passwordHash, fullName, phone, email },
    })

    await createSession({userId: user.id, role: user.role})

    redirect('/applications')
}