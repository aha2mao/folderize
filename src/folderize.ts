import * as vscode from 'vscode';
import {
   mkdirSync,
   readFileSync,
   writeFileSync,
   renameSync
} from 'fs';

import {Context, Option} from './types';
import {getOptions} from './options';
import {stringRegex, importRegex, firstEmptyLineRegex} from './regex';
import {formatIndexFile, formatImportPath, formatCssImport} from './format';

const createEmptyFolder = (c: Context) => {
	mkdirSync(c.folderPath);
};

const moveFileIntoFolder = (c: Context) => {
	renameSync(c.path, c.newPath);
};

const createIndexFile = (c: Context, o: Option[]) => {
	const indexPath = c.folderPath + '/index.' + c.filePath;
	const indexText = formatIndexFile(c.fileName);
	writeFileSync(indexPath, indexText);
};

const updateLocalImports = (c: Context, o: Option[]) => {
	const text = readFileSync(c.newPath, 'utf-8');
	let updatedText = text.replace(importRegex, (match) => {
		const newPath = match.replace(stringRegex, formatImportPath);
		return newPath;
	});
	const importCss = o.some(option => option.id === 'style');
	if (importCss) {
		updatedText = updatedText.replace(firstEmptyLineRegex, () => {
			return formatCssImport(c.fileName);
		});
	}
	writeFileSync(c.newPath, updatedText);
};

const createOptionalFiles = (c: Context, o: Option[]) => {
	o.forEach((option: Option) => {
		if (option.createFile) {
			const name = option.createFile;
			const path = c.folderPath + '/' + name;
			writeFileSync(path, option.fileContent || '');
		} else if (option.createFolder) {
			const name = option.createFolder;
			// const path = c.folderPath + '/' + name;
			mkdirSync(c.folderPath + '/' + name);
		}
	});
};

const createFolder = (context: Context, options: Option[]) => {
	createEmptyFolder(context);
	createIndexFile(context, options);
	createOptionalFiles(context, options);
	moveFileIntoFolder(context);
	updateLocalImports(context, options);
};

const showOptions = (context: Context) => {
	return vscode.window.showQuickPick(
		getOptions(context),
		{
			placeHolder: 'generate additional files',
			canPickMany: true,
			ignoreFocusOut: false
		}
	);
};

export const init = (event: vscode.Uri) => {
	const path = event.fsPath;
	const filePath = path.split('.').pop() || '';
	const folderPath = path.split('.').slice(0,-1).join('.');
	const fileName = folderPath.split('/').pop() || '';
	const newPath = folderPath + '/' + fileName + '.' + filePath;

	const context = {
		path,
		filePath,
		folderPath,
		fileName,
		newPath
	};
	
   showOptions(context).then((selectedOptions) => {
   	if (selectedOptions) {
      	createFolder(context, selectedOptions);
      }
   });
};