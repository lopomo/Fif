interface vkbeautify {
	xml: (notFormatedXml: string, indentPattern?: string) => string;
	xmlmin: (toMimifyXml: string, preserveComments: boolean) => string;
	sql: (notFormatedSql: string, indentPattern?: string) => string;
	sqlmin: (toMimifySql: string, preserveComments: boolean) => string;
}
declare var vkbeautify: vkbeautify;
declare module "vkbeautify" {
	export = vkbeautify;
}
