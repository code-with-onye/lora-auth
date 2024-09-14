import fs from "fs";
import * as https from "https";
import { execSync, spawn } from "child_process";

export function getWriteComponentPath(
  component: string,
  defaultPath = "loraauth/"
) {
  const path = "./src";

  if (fs.existsSync(path)) {
    return "./src/components" + defaultPath + component + ".tsx";
  } else {
    return "./components/" + defaultPath + component + ".tsx";
  }
}

export function createFolderAndFile(
  url: string,
  folderPath: string,
  fileName: string,
  isRoot: boolean = false
) {
  let filePath = isRoot
    ? `${folderPath}/${fileName}`
    : `./src/${folderPath}/${fileName}`;

  if (!fs.existsSync("./src")) {
    filePath = `./${folderPath}/${fileName}`;
  }

  fs.mkdirSync(isRoot ? folderPath : `./src/${folderPath}`, {
    recursive: true,
  });

  if (fs.existsSync(filePath)) {
    console.log(`File ${fileName} already exists, checking content...`);

    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const existingContent = fs.readFileSync(filePath, "utf8");

          if (existingContent === data) {
            console.log(
              `File ${fileName} is already up to date. No changes made.`
            );
          } else {
            console.log(`Updating file ${fileName}...`);
            fs.writeFileSync(filePath, data);
          }
        });
      })
      .on("error", (err) => {
        console.error("Failed to fetch file from URL", err);
      });
  } else {
    console.log(`Creating new file ${fileName}...`);
    writeFile(fileName, url, filePath);
  }
}

export function writeFile(action: string, url: string, filePath: string) {
  https
    .get(url, (response) => {
      const { statusCode } = response;

      if (statusCode !== 200) {
        console.error(
          `Failed to download ${action}. Status code: ${statusCode}`
        );
        response.resume(); 
        return;
      }

      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        if (fs.existsSync(filePath)) {
          fs.readFile(filePath, "utf-8", (err, existingData) => {
            if (err) {
              console.error(
                `Failed to read existing ${action} from ${filePath}`,
                err
              );
              return;
            }

            if (!existingData.includes(data)) {
              fs.appendFile(filePath, `\n${data}`, (err) => {
                if (err) {
                  console.error(
                    `Failed to append to ${action} in file: ${filePath}`,
                    err
                  );
                } else {
                  console.log(`${action} successfully appended to ${filePath}`);
                }
              });
            } else {
              console.log(`${action} is already present in ${filePath}`);
            }
          });
        } else {
          fs.writeFile(filePath, data, (err) => {
            if (err) {
              console.error(
                `Failed to write ${action} to file: ${filePath}`,
                err
              );
            } else {
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

export function createEnvFile() {
  https
    .get(
      "https://raw.githubusercontent.com/code-with-onye/lora-auth-templates/main/.env.sample",
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            fs.appendFileSync(".env.local", data, "utf8");
          } catch (err) {
            console.error(`Error appending data to file: ${err}`);
          }
        });
      }
    )
    .on("error", (err) => {
      console.error("Fail to create " + ".env.local", err);
    });
}

const isDependencyInstalled = (dep: string): boolean => {
  try {
    execSync(`npm ls ${dep} --depth=0`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

export const installDependencies = (
  deps: string[],
  isDev: boolean = false
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Filter out dependencies that are already installed
    const depsToInstall = deps.filter((dep) => !isDependencyInstalled(dep));

    if (depsToInstall.length === 0) {
      console.log(
        `All ${
          isDev ? "dev " : ""
        }dependencies are already installed. Skipping installation.`
      );
      return resolve();
    }

    const command = isDev
      ? ["install", "-D", ...depsToInstall]
      : ["install", ...depsToInstall];

    console.log(
      `Installing ${isDev ? "dev " : ""}dependencies: ${depsToInstall.join(
        ", "
      )}`
    );

    const installProcess = spawn("npm", command);

    installProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    installProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    installProcess.on("close", (code) => {
      if (code === 0) {
        console.log(
          `${isDev ? "Dev " : ""}dependencies installed successfully.`
        );
        resolve();
      } else {
        console.error(
          `Failed to install ${
            isDev ? "dev " : ""
          }dependencies with code ${code}`
        );
        reject(new Error(`Installation failed with code ${code}`));
      }
    });
  });
};
export const initNextAuth = async () => {
  console.log("Init LoraAuth...");
  // const routerPath = fs.existsSync("./src");
};
