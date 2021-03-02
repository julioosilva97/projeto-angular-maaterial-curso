import { MatDialog } from '@angular/material/dialog';
import { Contato } from './contato.model';
import { ContatoService } from './../contato.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  form :any = null;

  contatos: Contato[] = [];

  colunas: string[] = ['foto','id', 'nome', 'email', 'favorito'];

  totalElementos = 0;
  pagina = 0 ;
  tamanho = 1;
  pageSizeOptions : number[] = [1];


  constructor(private service : ContatoService,
    private fb : FormBuilder,
    private dialog : MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.montarForm();
    this.listar(this.pagina, this.tamanho);
  }

  listar(page:number,size:number){
    this.service.listar(page,size).subscribe(response=>{
      console.log(response)
      this.contatos = response.content;
      this.totalElementos = response.totalElements;
      this.pagina = response.number;
    },error=>console.log(error))
  }

  montarForm(){
    this.form = this.fb.group({
      nome : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]]
    });
  }

  favoritar(contato:Contato){
    this.service.favoritar(contato).subscribe(response => contato.favorito = !contato.favorito, error => console.log(error));
  }

  submit(){

    const formValues = this.form.value;
    const contato: Contato = {
      nome : formValues.nome,
      email: formValues.email
    }

    this.service.salvar(contato).subscribe(response => {

      this.listar(this.pagina, this.tamanho);
      this.snackBar.open('Contato salvo com sucesso.','',{
        duration:2000
      });
      this.form.reset();
    },error => console.log(error))
  }

  uploadFoto(event:Event,contato:Contato){

    const target= event.target as HTMLInputElement;

    const files = target.files ? target.files : [] ;

    if(files?.length > 0){
      const foto = files[0];

      const formData : FormData = new FormData();
      formData.append('foto',foto);

      this.service.uploadFoto(contato,formData).subscribe(response => {

        this.listar(this.pagina, this.tamanho);
      },error=>console.log(error));
    }
  }

  visualizar(contato:Contato){
    this.dialog.open(ContatoDetalheComponent, {
      width : '400px',
      height : '450px',
      data:contato
    })
  }

  paginar(event:PageEvent){
    this.pagina = event.pageIndex;
    this.listar(this.pagina, this.tamanho);
  }

}
