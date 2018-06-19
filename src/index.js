import { Converter } from "showdown";
import md from "./README.md";

const converter = new Converter();
const html = converter.makeHtml(md);
document.getElementById("content").innerHTML = html;
console.log(html);
