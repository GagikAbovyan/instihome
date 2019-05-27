import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export class DataService {
	// API
	private URL:string = environment.API_URL;
	private socket:any;
	// class variables
	private isSelected:boolean = false;
	private classes:any = [{name:'Empty', color:'red', number:0},{name:'Part empty', color:'blue', number:0}];
	private rectParams:any = [];

	/*
	 * initialize socket 
	 */
	constructor() {
		this.socket = io(this.URL);
	}

	/*
	 * send message to socket
	 */
	public sendMessage(message:any):void {
		this.socket.emit('add-data', message);
	}

	/*
	 * get socket message
	 */
	public getMessages() {
		return Observable.create((observer) => {
				this.socket.on('add-data', (message) => {
						observer.next(message);
				});
		});
	}

	/*
	 * get isSelected variable
	 */    
	public getSelected():boolean{
		return this.isSelected;
	}

	/*
	 * set isSelected variable
	 */ 
	public setSelected(isSelected:boolean):void{
		this.isSelected = isSelected;
	}

	/*
	 * get class array
	 */ 
	public getClasses():any{
		return this.classes;
	}

	/*
	 * get rect paramtres
	 */
	public getRectParams():any{
		return this.rectParams;
	}

	/*
	 * clear rectangle parameters
	 */
	public clearRectParams():void{
		this.rectParams = [];
	}

	/*
	 * change rect parameters
	 */
	public changeRectParams(params:any){
		this.rectParams = params;
	}

	/*
	 * disable set class for resize
	 */
	public disableClass():void {
		this.setSelected(false);
	}
	
}