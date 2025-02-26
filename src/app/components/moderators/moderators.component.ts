import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {ModeratorService} from "../../services/moderator.service";
import {Moderator} from "../../services/moderator.model";

@Component({
  selector: 'app-moderators',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './moderators.component.html',
  styleUrls: ['./moderators.component.scss']
})
export class ModeratorsComponent implements OnInit {

  moderators: Moderator[] = [];
  firstName: string = '';
  lastName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private moderatorService: ModeratorService) {}

  ngOnInit(): void {
    this.loadModerators();
  }

  loadModerators(): void {
    this.moderatorService.getModerators().subscribe(data => {
      this.moderators = data;
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addModerator(): void {
    if (!this.firstName || !this.lastName || !this.selectedFile) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.moderatorService.addModerator(formData).subscribe(() => {
      this.loadModerators();
      this.firstName = '';
      this.lastName = '';
      this.selectedFile = null;
      this.imagePreview = null;
    });
  }

  deleteModerator(id: string): void {
    this.moderatorService.deleteModerator(id).subscribe(() => {
      this.loadModerators();
    });
  }
}
