// Plugin de remark: calcula los minutos de lectura y los deja en el frontmatter (minutos).
export function remarkLectura() {
  return (tree, file) => {
    let palabras = 0;
    const visitar = (nodo) => {
      if (typeof nodo.value === 'string' && (nodo.type === 'text' || nodo.type === 'inlineCode')) {
        palabras += nodo.value.split(/\s+/).filter(Boolean).length;
      }
      nodo.children?.forEach(visitar);
    };
    visitar(tree);
    const fm = (file.data.astro ??= {}).frontmatter ?? (file.data.astro.frontmatter = {});
    fm.minutos = Math.max(1, Math.round(palabras / 200));
    fm.palabras = palabras;
  };
}
