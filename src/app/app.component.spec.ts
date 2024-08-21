import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

// Décrivez le bloc de tests pour AppComponent
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // Configuration initiale avant chaque test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],  // Déclarez le composant à tester
    })
    .compileComponents();
  });

  // Création du composant avant chaque test
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Détectez les changements dans le composant
  });

  // Test de création du composant
  it('should create the app', () => {
    expect(component).toBeTruthy();  // Vérifiez que le composant est créé
  });

  // Test de la propriété title
  it(`should have as title 'my-app'`, () => {
    expect(component.title).toEqual('my-app');  // Vérifiez la valeur de la propriété title
  });

  // Test pour vérifier si le titre est affiché correctement dans le template
  it('should render title in a h1 tag', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome to my-app!');  // Vérifiez le texte dans le tag h1
  });
});
