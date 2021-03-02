package io.github.julioosilva97.agendaapi.api.controller;

import io.github.julioosilva97.agendaapi.model.entity.Contato;
import io.github.julioosilva97.agendaapi.model.repository.ContatoRepository;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Part;
import javax.websocket.server.PathParam;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/contatos")
@CrossOrigin("*")
public class ContatoController {

    @Autowired
    ContatoRepository contatoRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contato salvar(@RequestBody Contato contato){
        return contatoRepository.save(contato);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Contato> listar (
            @RequestParam(value = "page",defaultValue = "0") Integer pagina,
            @RequestParam(value = "size",defaultValue = "10") Integer tamanho
    ){

        Sort sort = Sort.by(Sort.Direction.ASC,"id");
        PageRequest pageRequest = PageRequest.of(pagina,tamanho,sort);
        return  contatoRepository.findAll(pageRequest);
    }


    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Integer id){
        contatoRepository.deleteById(id);
    }

    @PatchMapping("{id}/favorito")
    public  void favoritar(@PathVariable Integer id){

        Optional<Contato> contato = contatoRepository.findById(id);

        contato.ifPresent( c -> {

            boolean favorito = c.getFavorito() == Boolean.TRUE;

            c.setFavorito(!favorito);
            contatoRepository.save(c);
        } );

    }


    @PatchMapping("{id}/foto")
    @ResponseStatus(HttpStatus.OK)
    public byte[] addFoto(@PathVariable Integer id,
                          @RequestParam("foto")Part foto){

        Optional<Contato> contato = contatoRepository.findById(id);

        return contato.map( c -> {
            try{

                InputStream is = foto.getInputStream();
                byte[] bytes = new byte[(int)foto.getSize()];
                IOUtils.readFully(is,bytes);
                c.setFoto(bytes);
                contatoRepository.save(c);
                is.close();
                return bytes;

            }catch (IOException e){
                return null;
            }
        }).orElse(null);
    }
}
