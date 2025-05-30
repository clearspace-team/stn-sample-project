import figlet from "figlet";

export const displayASCIIArt = (text: string) => {
  try {
    const asciiArt = figlet.textSync(text, {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    });
    console.log(asciiArt);
  } catch (error) {
    console.error("Error displaying ASCII art:", error);
  }
};
