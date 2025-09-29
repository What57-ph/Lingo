package com.lingo.testservice.model;

import java.util.List;

import com.lingo.testservice.utils.enums.MediaResourceCategory;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "media_resources")
public class MediaResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @Column(name = "resource_content", columnDefinition = "LONGTEXT")
    String resourceContent;
    @Nullable
    String description;
    @Enumerated(value = EnumType.STRING)
    MediaResourceCategory category;
    @OneToOne
    @JoinColumn(name = "test_id")
    Test test;
    @OneToMany(mappedBy = "resource", cascade = CascadeType.ALL)
    List<Question> questions;
}
