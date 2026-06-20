export function validarHora(hora: string): boolean {
  const regexHora = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  return regexHora.test(hora.trim());
}

export function validarObligatorio(valor: string): boolean {
  return valor.trim().length > 0;
}
