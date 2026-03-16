import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgFor, JsonPipe } from "@angular/common";
import { Employees } from "../../services/employees";

@Component({
	selector: "app-relacion-laboral",
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		NgFor,
		JsonPipe,
	],
	templateUrl: "./relacion-laboral.html",
	styleUrl: "./relacion-laboral.css",
})
export class RelacionLaboral implements OnInit {
	form!: FormGroup;
	yearOptions: number[] = [];

	constructor(
		private fb: FormBuilder,
		private employeesService: Employees,
	) {}

	ngOnInit(): void {
		const currentYear = new Date().getFullYear();
		for (let i = currentYear - 3; i <= currentYear + 2; i++) {
			this.yearOptions = [...this.yearOptions, i];
		}
		this.form = this.fb.group({
			year: [currentYear],
			registry: [""],
			teacherName: [""],
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
}
