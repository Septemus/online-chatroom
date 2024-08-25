export default class Contact {
	id: string;
	isOnline: boolean;
	name: string;
	avatar: string;
	constructor(id: string, isOnline: boolean) {
		this.id = id;
		this.isOnline = isOnline;
	}
}
