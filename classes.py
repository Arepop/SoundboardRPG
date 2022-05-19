# classes for buttons and tracks

from dataclasses import dataclass, field
from typing import List


@dataclass
class Track:
    title: str
    author: str
    url: str
    path: str
    description: str
    filter_field_0: str
    filter_field_1: str
    filter_field_2: str
    filter_field_3: str
    playlist: List[str] = field(default_factory=list)


@dataclass
class Sound:
    name: str
    url: str
    path: str
    description: str
    filter_field_0: str
    filter_field_1: str
    filter_field_2: str
    filter_field_3: str
