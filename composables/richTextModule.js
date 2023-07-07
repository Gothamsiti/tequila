export default () => {
    const richText = data => { 
        // cerco nel content se il PRIMO elemento è un paragraph vuoto allora lo elimino
        if(data.content[0] && data.content[0].type == 'paragraph' && !data.content[0].content) data.content.splice(0,1)

        var str = renderRichText(data);
        return str;
    };
    return { richText }
}