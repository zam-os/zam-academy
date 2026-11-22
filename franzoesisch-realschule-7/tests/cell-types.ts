import cellJson from "../cell.json";

/** The JSON import infers a union per item shape; tests read one explicit cell shape. */
export interface CellItem {
	id: string;
	slug: string;
	replaces?: string[];
	language: string;
	tier: string;
	bloom_level: number;
	question: string;
	concept: string;
	source_link: string;
	fast_check?: { type: string; options: string[]; correct_index: number };
	sample_solution?: string;
}
export interface CellAtom {
	id: string;
	slug: string;
	title: string;
	source_link: string;
	prerequisites: { atom_id: string; type: string; rationale: string }[];
	curricula: {
		provider: string;
		subject: string;
		topic_code: string;
		topic_title: string;
		school_type?: string;
		grade?: number;
		track?: string;
		exam_relevant?: boolean;
	}[];
	practice_items: CellItem[];
}
export interface Cell {
	tile_id: string;
	version: string;
	atoms: CellAtom[];
	retired_items?: string[];
}
export const cell = cellJson as unknown as Cell;
