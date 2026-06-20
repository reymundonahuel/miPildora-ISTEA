import React from "react";
import renderer from "react-test-renderer";
import Boton from "../../src/components/Boton";

/* Test realizado mediante uso de Agente de IA
IA Utilizada: Kimi K2.6
Plataforma: Opencode Go
Prompt: A partir de este proyecto realiza los tests para el componente de boton.
*/

describe("Boton", () => {
  it("renderiza correctamente con el título proporcionado", () => {
    const tree = renderer
      .create(<Boton titulo="Guardar" onPress={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renderiza con color personalizado", () => {
    const tree = renderer
      .create(<Boton titulo="Rojo" onPress={() => {}} color="#ff4444" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
