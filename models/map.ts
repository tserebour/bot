export default class MyMap<K, V> {
    private map: Map<K, V>;
  
    constructor() {
      this.map = new Map<K, V>();
    }
  
    set(key: K, value: V): void {
      this.map.set(key, value);
    }
  
    get(key: K): V | undefined {
      return this.map.get(key);
    }
  
    has(key: K): boolean {
      return this.map.has(key);
    }
  
    size(): number {
      return this.map.size;
    }
  
    delete(key: K): boolean {
      return this.map.delete(key);
    }
  
    clear(): void {
      this.map.clear();
    }
  
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
      this.map.forEach(callbackfn, thisArg);
    }
  
    entries(): IterableIterator<[K, V]> {
      return this.map.entries();
    }
  
    keys(): IterableIterator<K> {
      return this.map.keys();
    }
  
    values(): IterableIterator<V> {
      return this.map.values();
    }
  }
  