'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { STATUS_LABELS } from '@/lib/labels'
import type { Status } from '@/app/generated/prisma/client'

export async function updateStatus(formData: FormData): Promise<void> {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    redirect('/login')
  }

  const applicationId = String(formData.get('applicationId') ?? '')
  const statusRaw = String(formData.get('status') ?? '')
  const redirectToRaw = String(formData.get('redirectTo') ?? '/admin')
  const safeRedirectTo = redirectToRaw.startsWith('/admin') ? redirectToRaw : '/admin'

  if (!(statusRaw in STATUS_LABELS)) {
    redirect(safeRedirectTo)
  }
  const status = statusRaw as Status

  try {
    await prisma.application.update({ where: { id: applicationId }, data: { status } })
  } catch {
    redirect(safeRedirectTo)
  }

  const separator = safeRedirectTo.includes('?') ? '&' : '?'
  redirect(`${safeRedirectTo}${separator}updated=true`)
}
