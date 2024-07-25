import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { BehaviorSubject, find, map, Observable, pipe, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  public companies$: Observable<Company[]> =
    this.companiesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.http
      .get<Company[]>(
        'https://random-data-api.com/api/company/random_company?size=100'
      )
      .subscribe((data) => {
        this.companiesSubject.next(data);
      });
  }

  public getTypes(): Observable<string[]> {
    return this.companies$.pipe(
      map((companies) => [...new Set(companies.map((company) => company.type))])
    );
  }

  public getIndustries(): Observable<string[]> {
    return this.companies$.pipe(
      map((companies) => [
        ...new Set(companies.map((company) => company.industry)),
      ])
    );
  }

  public sortList(key: string): Observable<Company[]> {
    return this.companies$.pipe(
      map((companies) =>
        [...companies].sort((a, b) => a[key].localeCompare(b[key]))
      )
    );
  }

  public getCompanyById(id: number): Observable<Company | undefined> {
    return this.companies$.pipe(
      map((companies) => companies.find((company) => company.id === id))
    );
  }

  public resetList(): void {
    this.loadCompanies();
  }
}
