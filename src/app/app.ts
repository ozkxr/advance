import { Component, signal } from "@angular/core";
import { RelacionLaboral } from "./components/relacion-laboral/relacion-laboral";

@Component({
	selector: "app-root",
	imports: [RelacionLaboral],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("advance");
}
