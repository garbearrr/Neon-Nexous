import { Event } from "../Event/Event";

const slice = <T extends defined>(array: T[], start: number, ending: number): T[] => {
	const newArray: T[] = [];
	for (let i = start; i < ending; i++) {
		newArray.push(array[i]);
	}
	return newArray;
};

export class Collection<K extends defined, V extends defined> implements ICollection<K, V> {
	public readonly Events = {
		OnAdd: new Event<{Key: K, Value: V}>()
	};

	private readonly _Map: Map<K, V> = new Map<K, V>();

	public constructor() {}

	// Methods

	public Array(): V[] {
		const values: V[] = [];
		this._Map.forEach((value) => {
			values.push(value);
		});
		return values;
	}

	public At(index: number): V | undefined {
		const values = this.Array();
		const normalizedIndex = index >= 0 ? index : values.size() + index;
		return values[normalizedIndex];
	}

	public Clear(): void {
		this._Map.clear();
	}

	public Clone(): ICollection<K, V> {
		const clone = new Collection<K, V>();
		this._Map.forEach((value, key) => {
			clone.Set(key, value);
		});
		return clone;
	}

	public Concat(...collections: ICollection<K, V>[]): ICollection<K, V> {
		const clone = this.Clone();
		collections.forEach((collection) => {
			collection.ForEach((value, key) => {
				clone.Set(key, value);
			});
		});
		return clone;
	}

	public Delete(key: K): boolean {
		return this._Map.delete(key);
	}

	public Destroy(): void {
		this._Map.clear();
	}

	public Difference(collection: ICollection<K, V>): ICollection<K, V> {
		const clone = this.Clone();
		collection.ForEach((value, key) => {
			if (clone.Has(key)) {
				clone.Delete(key);
			}
		});
		return clone;
	}

	public Each(fn: (value: V, key: K) => void): ICollection<K, V> {
		this._Map.forEach((value, key) => {
			fn(value, key);
		});
		return this;
	}

	public Ensure(key: K, defaultValue: V): V {
		if (!this.Has(key)) {
			this.Set(key, defaultValue);
		}
		return this.Get(key)!;
	}

	public Entries(): [K, V][] {
		const entries: [K, V][] = [];
		this._Map.forEach((value, key) => {
			entries.push([key, value]);
		});
		return entries;
	}

	public Equals(collection: ICollection<K, V>): boolean {
		if (this.Size() !== collection.Size()) {
			return false;
		}
		for (const [key, value] of this._Map) {
			if (!collection.Has(key) || collection.Get(key) !== value) {
				return false;
			}
		}
		return true;
	}

	public Every(fn: (value: V, key: K) => boolean): boolean {
		for (const [key, value] of this._Map) {
			if (!fn(value, key)) {
				return false;
			}
		}
		return true;
	}

	public Filter(fn: (value: V, key: K) => boolean): ICollection<K, V> {
		const results = new Collection<K, V>();
		for (const [key, value] of this._Map) {
			if (fn(value, key)) {
				results.Set(key, value);
			}
		}
		return results;
	}

	public Find(fn: (value: V, key: K) => boolean): V | undefined {
		for (const [key, value] of this._Map) {
			if (fn(value, key)) {
				return value;
			}
		}
		return undefined;
	}

	public FindKey(fn: (value: V, key: K) => boolean): K | undefined {
		for (const [key, value] of this._Map) {
			if (fn(value, key)) {
				return key;
			}
		}
		return undefined;
	}

	public FindKeys(fn: (value: V, key: K) => boolean): K[] | undefined {
		const keys: K[] = [];
		for (const [key, value] of this._Map) {
			if (fn(value, key)) {
				keys.push(key);
			}
		}
		return keys.size() === 0 ? undefined : keys;
	}

	public First(count?: number): V | V[] | undefined {
		if (count === undefined) {
			return this.Array()[0];
		}
		return slice(this.Array(), 0, count);
	}

	public FlatMap<U extends defined>(fn: (value: V, key: K) => U[]): U[] {
		const results: U[] = [];
		this._Map.forEach((value, key) => {
			const mappedValues = fn(value, key);
			mappedValues.forEach((mappedValue) => {
				results.push(mappedValue);
			});
		});
		return results;
	}

	public ForEach(fn: (value: V, key: K) => void): void {
		this._Map.forEach((value, key) => {
			fn(value, key);
		});
	}

	public Get(key: K): V | undefined {
		return this._Map.get(key);
	}

	public Has(key: K): boolean {
		return this._Map.has(key);
	}

	public HasAll(...keys: K[]): boolean {
		return keys.every((key: K) => this.Has(key));
	}

	public HasAny(...keys: K[]): boolean {
		return keys.some((key: K) => this.Has(key));
	}

	public Intersect(collection: ICollection<K, V>): ICollection<K, V> {
		const clone = this.Clone();
		collection.ForEach((value, key) => {
			if (!clone.Has(key)) {
				clone.Delete(key);
			}
		});
		return clone;
	}

	public IsEmpty(): boolean {
		return this.Size() === 0;
	}

	public KeyArray(): K[] {
		const keys: K[] = [];
		this._Map.forEach((_value, key) => {
			keys.push(key);
		});
		return keys;
	}
	
	public KeyAt(index: number): K | undefined {
		const keys = this.KeyArray();
		const normalizedIndex = index >= 0 ? index : keys.size() + index;
		return keys[normalizedIndex];
	}

	public Keys(): K[] {
		return this.KeyArray();
	}

	public Last(): V | V[] | undefined {
		const values = this.Array();
		return values[values.size() - 1];
	}

	public LastKey(): K | undefined {
		const keys = this.KeyArray();
		return keys[keys.size() - 1];
	}

	public Map<T extends defined>(fn: (value: V, key: K) => T): T[] {
		const arr: T[] = [];
		this._Map.forEach((value, key) => {
			arr.push(fn(value, key));
		});
		return arr;
	}

	public MapValues(fn: (value: V, key: K) => V): ICollection<K, V> {
		const clone = this.Clone();
		clone.ForEach((value, key) => {
			clone.Set(key, fn(value, key));
		});
		return clone;
	}

	public Merge<T extends V>(
		collection: ICollection<K, T>,
		whenInSelf: (value: V, key: K) => Keep<V>,
		whenInOther: (valueOther: T, key: K) => Keep<V>,
		whenInBoth: (value: V, valueOther: T, key: K) => Keep<V>,
	): ICollection<K, V> {
		const clone = this.Clone();
		collection.ForEach((value, key) => {
			if (clone.Has(key)) {
				const keep = whenInBoth(clone.Get(key)!, value, key);
				if (keep.keep) {
					clone.Set(key, keep.value);
				} else {
					clone.Delete(key);
				}
			} else {
				const keep = whenInOther(value, key);
				if (keep.keep) {
					clone.Set(key, keep.value);
				}
			}
		});
		clone.ForEach((value, key) => {
			const keep = whenInSelf(value, key);
			if (!keep.keep) {
				clone.Delete(key);
			}
		});
		return clone;
	}

	public Partition(fn: (value: V, key: K) => boolean): [ICollection<K, V>, ICollection<K, V>] {
		const clone = this.Clone();
		const truthy = new Collection<K, V>();
		const falsy = new Collection<K, V>();
		clone.ForEach((value, key) => {
			if (fn(value, key)) {
				truthy.Set(key, value);
			} else {
				falsy.Set(key, value);
			}
		});
		return [truthy, falsy];
	}

	public Random(): V | undefined {
		const values = this.Array();
		return values[math.floor(math.random() * values.size())];
	}

	public RandomKey(): K | undefined {
		const keys = this.KeyArray();
		return keys[math.floor(math.random() * keys.size())];
	}

	public Reduce<T>(fn: (accumulator: T, value: V, key: K) => T, initial: T): T {
		let accumulator = initial;
		for (const [key, value] of this._Map) {
			accumulator = fn(accumulator, value, key);
		}
		return accumulator;
	}

	public Reverse(): ICollection<K, V> {
		const clone = this.Clone();
		const entries = clone.Entries();
		clone.Clear();
		entries.forEach(([key, value]) => {
			clone.Set(key, value);
		});
		return clone;
	}

	public Set(key: K, value: V): V {
		this._Map.set(key, value);
		this.Events.OnAdd.Fire({Key: key, Value: value});
		return value;
	}

	public Size(): number {
		return this._Map.size();
	}

	public Some(fn: (value: V, key: K) => boolean): boolean {
		for (const [key, value] of this._Map) {
			if (fn(value, key)) {
				return true;
			}
		}
		return false;
	}

	public Sort(fn: (a: V, b: V) => number): ICollection<K, V> {
		// Gather entries from the map
		const entries: [K, V][] = [];
		this._Map.forEach((value, key) => {
			entries.push([key, value]);
		});
	
		// Implementing Bubble Sort
		let swapped: boolean;
		do {
			swapped = false;
			for (let i = 0; i < entries.size() - 1; i++) {
				if (fn(entries[i][1], entries[i + 1][1]) > 0) {
					[entries[i], entries[i + 1]] = [entries[i + 1], entries[i]];
					swapped = true;
				}
			}
		} while (swapped);
	
		// Create a new sorted collection
		const sortedCollection = new Collection<K, V>();
		for (const [key, value] of entries) {
			sortedCollection.Set(key, value);
		}
	
		return sortedCollection;
	}

	public Sweep(fn: (value: V, key: K) => boolean): number {
		let count = 0;
		this._Map.forEach((value, key) => {
			if (fn(value, key)) {
				this._Map.delete(key);
				count++;
			}
		});
		return count;
	}

	public Tap(fn: (collection: ICollection<K, V>) => void): ICollection<K, V> {
		fn(this);
		return this;
	}

	public ToJSON(): V[] {
		return [...this.Values()];
	}

	public Values(): V[] {
		const values: V[] = [];
		this._Map.forEach((value) => {
			values.push(value);
		});
		return values;
	}
}