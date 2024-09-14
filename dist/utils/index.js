"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.initNextAuth = exports.installDependencies = void 0;
exports.getWriteComponentPath = getWriteComponentPath;
exports.createFolderAndFile = createFolderAndFile;
exports.writeFile = writeFile;
exports.createEnvFile = createEnvFile;
const fs_1 = __importDefault(require("fs"));
const https = __importStar(require("https"));
const child_process_1 = require("child_process");
function getWriteComponentPath(component, defaultPath = "loraauth/") {
    const path = "./src";
    if (fs_1.default.existsSync(path)) {
        return "./src/components" + defaultPath + component + ".tsx";
    }
    else {
        return "./components/" + defaultPath + component + ".tsx";
    }
}
function createFolderAndFile(url, folderPath, fileName, isRoot = false) {
    let filePath = isRoot
        ? `${folderPath}/${fileName}`
        : `./src/${folderPath}/${fileName}`;
    if (!fs_1.default.existsSync("./src")) {
        filePath = `./${folderPath}/${fileName}`;
    }
    fs_1.default.mkdirSync(isRoot ? folderPath : `./src/${folderPath}`, {
        recursive: true,
    });
    if (fs_1.default.existsSync(filePath)) {
        console.log(`File ${fileName} already exists, checking content...`);
        https
            .get(url, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                const existingContent = fs_1.default.readFileSync(filePath, "utf8");
                if (existingContent === data) {
                    console.log(`File ${fileName} is already up to date. No changes made.`);
                }
                else {
                    console.log(`Updating file ${fileName}...`);
                    fs_1.default.writeFileSync(filePath, data);
                }
            });
        })
            .on("error", (err) => {
            console.error("Failed to fetch file from URL", err);
        });
    }
    else {
        console.log(`Creating new file ${fileName}...`);
        writeFile(fileName, url, filePath);
    }
}
function writeFile(action, url, filePath) {
    https
        .get(url, (response) => {
        const { statusCode } = response;
        if (statusCode !== 200) {
            console.error(`Failed to download ${action}. Status code: ${statusCode}`);
            response.resume();
            return;
        }
        let data = "";
        response.on("data", (chunk) => {
            data += chunk;
        });
        response.on("end", () => {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.readFile(filePath, "utf-8", (err, existingData) => {
                    if (err) {
                        console.error(`Failed to read existing ${action} from ${filePath}`, err);
                        return;
                    }
                    if (!existingData.includes(data)) {
                        fs_1.default.appendFile(filePath, `\n${data}`, (err) => {
                            if (err) {
                                console.error(`Failed to append to ${action} in file: ${filePath}`, err);
                            }
                            else {
                                console.log(`${action} successfully appended to ${filePath}`);
                            }
                        });
                    }
                    else {
                        console.log(`${action} is already present in ${filePath}`);
                    }
                });
            }
            else {
                fs_1.default.writeFile(filePath, data, (err) => {
                    if (err) {
                        console.error(`Failed to write ${action} to file: ${filePath}`, err);
                    }
                    else {
                        console.log(`${action} successfully written to ${filePath}`);
                    }
                });
            }
        });
    })
        .on("error", (err) => {
        console.error(`Failed to download ${action}. Error:`, err);
    });
}
function createEnvFile() {
    https
        .get("https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/.env.sample", (response) => {
        let data = "";
        response.on("data", (chunk) => {
            data += chunk;
        });
        response.on("end", () => {
            try {
                fs_1.default.appendFileSync(".env.local", data, "utf8");
            }
            catch (err) {
                console.error(`Error appending data to file: ${err}`);
            }
        });
    })
        .on("error", (err) => {
        console.error("Fail to create " + ".env.local", err);
    });
}
const isDependencyInstalled = (dep) => {
    try {
        (0, child_process_1.execSync)(`npm ls ${dep} --depth=0`, { stdio: "ignore" });
        return true;
    }
    catch (_a) {
        return false;
    }
};
const installDependencies = (deps, isDev = false) => {
    return new Promise((resolve, reject) => {
        // Filter out dependencies that are already installed
        const depsToInstall = deps.filter((dep) => !isDependencyInstalled(dep));
        if (depsToInstall.length === 0) {
            console.log(`All ${isDev ? "dev " : ""}dependencies are already installed. Skipping installation.`);
            return resolve();
        }
        const command = isDev
            ? ["install", "-D", ...depsToInstall]
            : ["install", ...depsToInstall];
        console.log(`Installing ${isDev ? "dev " : ""}dependencies: ${depsToInstall.join(", ")}`);
        const installProcess = (0, child_process_1.spawn)("npm", command);
        installProcess.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });
        installProcess.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });
        installProcess.on("close", (code) => {
            if (code === 0) {
                console.log(`${isDev ? "Dev " : ""}dependencies installed successfully.`);
                resolve();
            }
            else {
                console.error(`Failed to install ${isDev ? "dev " : ""}dependencies with code ${code}`);
                reject(new Error(`Installation failed with code ${code}`));
            }
        });
    });
};
exports.installDependencies = installDependencies;
const initNextAuth = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Init LoraAuth...");
    // const routerPath = fs.existsSync("./src");
});
exports.initNextAuth = initNextAuth;
