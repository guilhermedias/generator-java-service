package <%=defaultPackage%>;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
public class <%=restClassName%>RestController {

    @GetMapping
    @ResponseStatus(OK)
    public <%=restClassName%> get(@RequestParam("id") String id) {
        //TODO: fetch the data from service layer.
        return <%=restClassName%>.from(id);
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(CREATED)
    public <%=restClassName%> create(@RequestBody <%=restClassName%> resource) {
        //TODO: goes to service layer to create the entity.
        return <%=restClassName%>.createSelfLink(resource);
    }

    @DeleteMapping
    @ResponseStatus(NO_CONTENT)
    public void delete(@RequestParam("id") String id) {
        //TODO: Goes to service layer and delete the entity.
    }

    @AllArgsConstructor
    @Getter
    private static class <%=restClassName%> extends ResourceSupport {
        private final UUID resourceId;

        private static <%=restClassName%> from(String id) {
            <%=restClassName%> resource = new <%=restClassName%>(UUID.fromString(id));
            resource.add(linkTo(methodOn(<%=restClassName%>RestController.class)
                    .get(id))
                    .withSelfRel());
            return resource;
        }

        private static <%=restClassName%> createSelfLink(<%=restClassName%> resource) {
            return from(resource.getResourceId().toString());
        }
    }
}
