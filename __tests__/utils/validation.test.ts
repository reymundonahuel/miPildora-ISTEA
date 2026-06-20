import { validarHora, validarObligatorio } from "../../src/utils/validation";

/* Test realizado mediante uso de Agente de IA
IA Utilizada: Kimi K2.6
Plataforma: Opencode Go
Prompt: A partir de este proyecto realiza los tests para la funcion de validacion de hora y obligatorio.
*/

describe("validarHora", () => {
  it("acepta formato válido HH:MM", () => {
    expect(validarHora("14:30")).toBe(true);
    expect(validarHora("08:00")).toBe(true);
    expect(validarHora("23:59")).toBe(true);
    expect(validarHora("00:00")).toBe(true);
    expect(validarHora("9:05")).toBe(true);
  });

  it("rechaza formato inválido", () => {
    expect(validarHora("25:00")).toBe(false);
    expect(validarHora("12:60")).toBe(false);
    expect(validarHora("abc")).toBe(false);
    expect(validarHora("")).toBe(false);
    expect(validarHora("14:30:00")).toBe(false);
  });
});

describe("validarObligatorio", () => {
  it("acepta valores no vacíos", () => {
    expect(validarObligatorio("texto")).toBe(true);
    expect(validarObligatorio("a")).toBe(true);
  });

  it("rechaza valores vacíos o solo espacios", () => {
    expect(validarObligatorio("")).toBe(false);
    expect(validarObligatorio("   ")).toBe(false);
  });
});
