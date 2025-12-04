export default function filterLogic(initialArtifacts: any[]) {
  return {
    // --- State (相当于 useState) ---
    formats: ['article', 'status'], // 默认全选
    categories: ['thinking', 'criticism', 'emotion'], // 默认全选
    
    // --- Actions (相当于处理函数) ---
    toggle(arrName: 'formats' | 'categories', item: string) {
      // @ts-ignore - Alpine proxy handling
      const arr = this[arrName] as string[];
      if (arr.includes(item)) {
        // @ts-ignore
        this[arrName] = arr.filter(i => i !== item);
      } else {
        // @ts-ignore
        this[arrName].push(item);
      }
    },

    // --- Computed (相当于 useMemo) ---
    isVisible(postFormat: string, postCategory: string) {
      // @ts-ignore
      return this.formats.includes(postFormat) && 
             // @ts-ignore
             this.categories.includes(postCategory);
    },

    get visibleCount() {
      // @ts-ignore
      return initialArtifacts.filter(p => 
        this.isVisible(p.data.format, p.data.category)
      ).length;
    }
  };
}
