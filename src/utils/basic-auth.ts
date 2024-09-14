import fs from "fs";

import {
  createEnvFile,
  createFolderAndFile,
  installDependencies,
  writeFile,
} from ".";

export const initBasicAuth = async () => {
  console.log("Initializing LoraAuth...");
  writeFile(
    "routes",
    "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/routes.ts",
    "routes.ts"
  );

  createEnvFile();

  if (fs.existsSync("./src")) {
    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/middleware.ts",
      "./src",
      "middleware.ts",
      true
    );
    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/server/useSignIn.ts",
      "./src/hooks/server",
      "useSignin.ts",
      true
    );

    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/client/useSignIn.ts",
      "./src/hooks/client",
      "useSignin.ts",
      true
    );

    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/schema.ts",
      "./src",
      "schema.ts",
      true
    );

    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/utils/axios.ts",
      "./src/utils",
      "axios.ts",
      true
    );

    try {
      await installDependencies([
        "zod",
        "@tanstack/react-query",
        "zustand",
        "js-cookie",
        "axios",
      ]);
      await installDependencies(["@types/js-cookie"], true);
    } catch (error) {
      console.error("Error during dependency installation:", error);
    }
  } else {
    writeFile(
      "middlware",
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/middleware.ts",
      "middleware.ts"
    );
    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/server/useSignIn.ts",
      "./hooks/server",
      "useSignin.ts",
      true
    );
    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/client/useSignIn.ts",
      "./hooks/client",
      "useSignin.ts",
      true
    );
    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/schema.ts",
      "./",
      "schema.ts",
      true
    );

    createFolderAndFile(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/utils/axios.ts",
      "./utils",
      "axios.ts",
      true
    );

    try {
      await installDependencies([
        "zod",
        "@tanstack/react-query",
        "zustand",
        "js-cookie",
        "axios",
      ]);
      await installDependencies(["@types/js-cookie"], true);
    } catch (error) {
      console.error("Error during dependency installation:", error);
    }
  }
};
