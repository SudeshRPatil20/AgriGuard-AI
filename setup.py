from setuptools import find_packages, setup

from typing import List
import os
Hyphen_dot='-e .'
def get_requirements(file_path:str)->List[str]:
    """ Hear i have use replace because it will directly go to the file and the runs one by one line and the connect to requireements.txt"""
    requrements = []
    with open(file_path, 'r') as file:
        requrements=file.readlines()
        requrements=[req.replace("\n", " ") for req in requrements]
        
        if Hyphen_dot in requrements:
            requrements.remove(Hyphen_dot)
        
        
    return requrements

setup(
    name='Fertilizer_pridiction',
    version='0.0.1',
    author='sudesh',
    author_email='sudeshrpatil20121@gmail.com',
    packages=find_packages(),
    install_requires=get_requirements('requirements.txt')
)