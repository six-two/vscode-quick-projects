// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
// function activate(context) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "sixtwo-quickprojects" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('sixtwo-quickprojects.helloWorld', function () {
// 		// The code you place here will be executed every time your command is executed

// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from quick-projects!');
// 	});

// 	context.subscriptions.push(disposable);
// }

const vscode = require('vscode');
const fs = require('fs').promises;
const os = require('os');

function activate(context) {
  let disposable = vscode.commands.registerCommand('sixtwo-quickprojects.helloWorld', async () => {
    try {
      // Define the path to the directory
      const directoryPath = os.homedir() + '/c';

      // Read the contents of the directory
      const items = await fs.readdir(directoryPath);

      // Filter out only directories
      const dirs = await Promise.all(items.map(item => {
        return fs.stat(`${directoryPath}/${item}`).then(stat => stat.isDirectory());
      }));

      // Filter items array to include only directories
      const filteredItems = items.filter((_, index) => dirs[index]);

      // Prepare the items for the quick pick menu
      const itemsForMenu = filteredItems.map(item => ({
        label: item,
        description: item,
        detail: item
      }));

      // Show the quick pick menu
      vscode.window.showQuickPick(itemsForMenu).then(async selectedItem => {
        if (selectedItem) {
			// Construct the full path of the selected item
			const fullPath = `${directoryPath}/${selectedItem.label}`;

			// Open the directory in VSCode
			const openInNewWindow = false;
			const url = vscode.Uri.file(fullPath);
			vscode.commands.executeCommand('vscode.openFolder', url, openInNewWindow).then(
				() => { },
				e => vscode.window.showInformationMessage(`Project directory open failed: ${e}`)
			);
		}
      });
    } catch (error) {
      console.error(error);
      vscode.window.showErrorMessage('Failed to list or open directory.');
    }
  });

  context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
