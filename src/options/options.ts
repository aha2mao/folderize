import {Context} from '../types';

export const getOptions = (c: Context) => {
	return [
		{	
			'id': 'test',
			'label': 'Add test file',
			'description': `${c.fileName}.test.${c.filePath}`,
			'createFile': `${c.fileName}.test.${c.filePath}`
		},
		{
			'id': 'style',
			'label': 'Add CSS module',
			'description': `${c.fileName}.style.js`,
			'createFile': `${c.fileName}.style.js`,
			'fileContent': `import * as StyleSheet from 'VUI/StyleSheet'\nimport {pageBackgroundColor} from 'VUI/Colors'\n\nexport default StyleSheet.create({\n    container: {\n        flex: 1,\n        height: '100%',\n        backgroundColor: pageBackgroundColor\n    }\n})`
		},
		{
			'id': 'images',
			'label': 'Add image folder',
			'description': 'images',
			'createFolder': 'images'
		}
	];
};

// TODO: add optional congif file