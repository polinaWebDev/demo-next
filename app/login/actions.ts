"use server"

import {createSession} from "@/lib/session";
import {prisma} from "@/lib/prisma";
import {verifyPassword} from "@/lib/password";
import {redirect} from "next/navigation";

export interface LoginState {
    formError?: string
}


export async function login(_prevState:LoginState,formData: FormData ) {
    const login = String(formData.get('login') ?? '')
    const password = String(formData.get('password') ?? '')

    if (!login || !password) {
        return { formError: 'Заполните все поля' }
    }

    const user = await prisma.user.findUnique({ where: { login } })
    if (!user) {
        return { formError: 'Пользователь не найден' }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
        return { formError: 'Неверный логин или пароль' }
    }

    await createSession({userId: user.id, role: user.role})

    redirect('/applications')
}