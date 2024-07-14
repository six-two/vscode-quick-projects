const vscode = require('vscode');
const fs = require('fs').promises;
const os = require('os');

/**
 * 
 * @param {*} directoryPathList a list of all directories to search
 * @returns a list of {label: name of folder, description: full path} that can be used with the quick pick menu
 */
const getListOfChildDirectories = async (directoryPathList) => {
    let items = [];
    for (const rootDir of directoryPathList) {
        // Skip empty values
        if (rootDir) {
            try {
                const fileNames = await fs.readdir(rootDir)
                console.debug(fileNames);
                items.push(...fileNames.map(name => ({
                    label: name,
                    description: `${rootDir}/${name}`,
                })));
            } catch (error) {
                console.error(error);
                vscode.window.showErrorMessage(`Failed to list or open directory: ${error}`);
            }
        }
    }
    console.debug(items);

    const isDir = await Promise.all(items.map(item => {
        return fs.stat(item.description).then(stat => stat.isDirectory());
    }));

    return items.filter((_, index) => isDir[index])
}

const listSubDirectoriesAndOpenTheOneTheUserChooses = async (directoryPathList) => {
    try {
        // Read the contents of the directory
        const items = getListOfChildDirectories(directoryPathList);
        if (!items) {
            vscode.window.showInformationMessage("No child directories found");
            return;
        }

        // Show the quick pick menu
        vscode.window.showQuickPick(items, {
            placeHolder: 'Please select a project folder to open',
            matchOnDescription: false,
            matchOnDetail: false
        }).then(async selectedItem => {
            if (selectedItem) {
                // Open the directory in VSCode
                const openInNewWindow = getConfigOption("openInNewWindow");
                // The description stores the full path to the item
                const url = vscode.Uri.file(selectedItem.description);
                vscode.commands.executeCommand('vscode.openFolder', url, openInNewWindow)
                    .catch(e => vscode.window.showErrorMessage(`Project directory open failed: ${e}`));
            }
        });
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage(`Unexpected error: ${error}`);
    }
}

const registerMyCommand = (context, name, directoryListFunction) => {
    const disposable = vscode.commands.registerCommand(`sixtwo-quickprojects.choose-${name}`, () => listSubDirectoriesAndOpenTheOneTheUserChooses(directoryListFunction()));

    context.subscriptions.push(disposable);
}

const expandHome = (path) => {
    if (!path) {
        // Handle cases like null or undefined
        return ""
    } else if (path.startsWith("~")) {
        return os.homedir() + path.slice(1);
    } else {
        return path
    }
}

const getConfigOption = (name) => {
    return vscode.workspace.getConfiguration('quickProjects')
        .get(name);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    try {    
        registerMyCommand(context, "personal", () => [expandHome(getConfigOption("personalDir"))]);
        registerMyCommand(context, "external", () => [expandHome(getConfigOption("externalDir"))]);
        registerMyCommand(context, "work", () => [expandHome(getConfigOption("workDir"))]);
        registerMyCommand(context, "any", () => [expandHome(getConfigOption("personalDir")), expandHome(getConfigOption("externalDir")), expandHome(getConfigOption("workDir"))]);
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage(`Unexpected error during initialization: ${error}`);
    }
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
