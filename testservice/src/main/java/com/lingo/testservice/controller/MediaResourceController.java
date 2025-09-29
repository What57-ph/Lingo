package com.lingo.testservice.controller;

import com.lingo.testservice.model.dto.request.resource.ReqMediaResourceDTO;
import com.lingo.testservice.model.dto.response.ResMediaResourceDTO;
import com.lingo.testservice.service.MediaResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resource")
@RequiredArgsConstructor
public class MediaResourceController {
    private final MediaResourceService mediaResourceService;

    @PostMapping("/add")
    public ResMediaResourceDTO add(@RequestBody ReqMediaResourceDTO dto) {
        return mediaResourceService.add(dto);
    }

    @PutMapping("/update/{id}")
    public ResMediaResourceDTO update(@RequestBody ReqMediaResourceDTO dto,
            @PathVariable("id") long id) {
        return mediaResourceService.update(dto, id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id) {
        mediaResourceService.delete(id);
    }

    @GetMapping("/all")
    public List<ResMediaResourceDTO> getAll() {
        return mediaResourceService.getAll();
    }

    @GetMapping("/one/{id}")
    public ResMediaResourceDTO getOne(@PathVariable long id) throws Exception {
        return mediaResourceService.getOne(id);
    }
}
