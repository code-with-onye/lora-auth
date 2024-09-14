"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBasicAuth = void 0;
const fs_1 = __importDefault(require("fs"));
const _1 = require(".");
const initBasicAuth = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Initializing LoraAuth...");
    (0, _1.writeFile)("routes", "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/routes.ts", "routes.ts");
    (0, _1.createEnvFile)();
    if (fs_1.default.existsSync("./src")) {
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/middleware.ts", "./src", "middleware.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/server/useSignIn.ts", "./src/hooks/server", "useSignin.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/client/useSignIn.ts", "./src/hooks/client", "useSignin.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/schema.ts", "./src", "schema.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/utils/axios.ts", "./src/utils", "axios.ts", true);
        try {
            yield (0, _1.installDependencies)([
                "zod",
                "@tanstack/react-query",
                "zustand",
                "js-cookie",
                "axios",
            ]);
            yield (0, _1.installDependencies)(["@types/js-cookie"], true);
        }
        catch (error) {
            console.error("Error during dependency installation:", error);
        }
    }
    else {
        (0, _1.writeFile)("middlware", "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/middleware.ts", "middleware.ts");
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/server/useSignIn.ts", "./hooks/server", "useSignin.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/hooks/client/useSignIn.ts", "./hooks/client", "useSignin.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/schema.ts", "./", "schema.ts", true);
        (0, _1.createFolderAndFile)("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/src/utils/axios.ts", "./utils", "axios.ts", true);
        try {
            yield (0, _1.installDependencies)([
                "zod",
                "@tanstack/react-query",
                "zustand",
                "js-cookie",
                "axios",
            ]);
            yield (0, _1.installDependencies)(["@types/js-cookie"], true);
        }
        catch (error) {
            console.error("Error during dependency installation:", error);
        }
    }
});
exports.initBasicAuth = initBasicAuth;
