import { ENCRYPTION_PASSPHRASE, ENCRYPTION_SALT } from '@/utils/constants'

let cachedKey: CryptoKey | null = null

async function deriveKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(ENCRYPTION_PASSPHRASE),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  cachedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(ENCRYPTION_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
  return cachedKey
}

export async function encrypt(data: string): Promise<string> {
  const key = await deriveKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(data),
  )
  const ivB64 = btoa(String.fromCharCode(...iv))
  const dataB64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  return `${ivB64}:${dataB64}`
}

export async function decrypt(ciphertext: string): Promise<string> {
  const [ivB64, dataB64] = ciphertext.split(':')
  if (!ivB64 || !dataB64) throw new Error('Invalid ciphertext format')
  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0))
  const data = Uint8Array.from(atob(dataB64), (c) => c.charCodeAt(0))
  const key = await deriveKey()
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(decrypted)
}
