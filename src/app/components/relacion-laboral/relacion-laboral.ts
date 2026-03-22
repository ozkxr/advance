import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from "@angular/material/card";
import { Employees } from "../../services/employees";
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonPipe } from "@angular/common";



@Component({
	selector: "app-relacion-laboral",
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatRadioModule,
		MatCardModule,
		MatExpansionModule,
		JsonPipe,
	],
	templateUrl: "./relacion-laboral.html",
	styleUrl: "./relacion-laboral.css",
})
export class RelacionLaboral implements OnInit {
	form!: FormGroup;
	yearOptions: number[] = [];
	readonly monthNames = [
		'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
	];

	constructor(
		private fb: FormBuilder,
		private employeesService: Employees,
	) { }

	ngOnInit(): void {
		const currentYear = new Date().getFullYear();
		for (let i = currentYear - 3; i <= currentYear + 2; i++) {
			this.yearOptions = [...this.yearOptions, i];
		}
		this.form = this.fb.group({
			year: [currentYear],
			registry: [""],
			teacherName: [""],
			months: this.fb.array(Array.from({ length: 12 }, (_, i) => this.createMonthGroup(i, currentYear))),
			hasLeave: [false],
			leaveNotes: [''],
			signatories: this.fb.array([
				this.fb.group({ fullName: ['TAE César Guzmán'] }),
				this.fb.group({ fullName: ['Lic. Zoot. Merlin Wilfrido Osorio López'] }),
			]),
		});

		// Subscribe to update month max day -- just for leap years
		this.form.get('year')!.valueChanges.subscribe(year => {
			this.months.controls.forEach((ctrl, i) => {
				const lastDay = new Date(year, i + 1, 0).getDate();
				ctrl.patchValue({ endDay: lastDay, lastDay: lastDay });
			});
		});
	}

	onRegistryChange(): void {
		const registry = this.form.get("registry")!.value?.trim();

		if (!registry || registry.length < 6) {
			this.form.patchValue({ teacherName: "" });
			return;
		}

		const employee = this.employeesService.findByRegistry(registry);

		if (employee) {
			this.form.patchValue({ teacherName: employee.fullName });
		} else {
			this.form.patchValue({ teacherName: "" });
		}
	}

	private createMonthGroup(monthIndex: number, year: number): FormGroup {
		const lastDay = new Date(year, monthIndex + 1, 0).getDate();
		return this.fb.group({
			startDay: [1],
			endDay: [lastDay],
			lastDay: [lastDay],
			position: [''],
			rolePerformed: [''],
			active: [false],
		});
	}

	get months(): FormArray {
		return this.form.get('months') as FormArray;
	}
}
