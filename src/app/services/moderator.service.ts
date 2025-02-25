import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Moderator} from './moderator.model';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  private apiUrl = 'http://localhost:8080/api/moderators';

  constructor(private http: HttpClient) {
  }

  getModerators(): Observable<Moderator[]> {
    return this.http.get<Moderator[]>(this.apiUrl);
  }

  addModerator(formData: FormData): Observable<Moderator> {
    return this.http.post<Moderator>(this.apiUrl, formData);
  }

  deleteModerator(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getModeratorById(id: string): Observable<Moderator> {
    return this.http.get<Moderator>(`${this.apiUrl}/\${id}`);
  }
}
