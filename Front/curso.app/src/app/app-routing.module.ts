import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './cursos/componentes/formulario/formulario.component';
import { ListaComponent } from './cursos/componentes/lista/lista.component';

const routes: Routes = [
  {path: '', component: ListaComponent},
  {path: 'criar', component: FormularioComponent },
  {path: 'editar/id', component: FormularioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
