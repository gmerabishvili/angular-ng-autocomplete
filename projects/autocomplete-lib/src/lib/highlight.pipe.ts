import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(text: any, search: any, searchKeyword?: any): any {
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    const regex = new RegExp(pattern, 'gi');

    if (!search) {
      return text;
    }

    if (searchKeyword) {
      const name = text[searchKeyword].replace(regex, (match) => `<b>${match}</b>`);
      // copy original object
      const textCopied = {...text};
      // set bold value into searchKeyword of copied object
      textCopied[searchKeyword] = name;
      return textCopied;
    } else {
      return search ? text.replace(regex, (match) => `<b>${match}</b>`) : text;
    }
  }
}
