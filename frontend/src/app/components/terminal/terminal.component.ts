import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SoundService } from '../../services/sound.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terminal',
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {

  isTerminal = true;
  commandInput: string = '';
  outputLines: string[] = [];
  private commands: { [key: string]: string } = {
    help: `Available commands: whoami, about, skills, contact, version, clear, exit`,

    whoami: `👩🏻 Honey Patel\n📍 Vadodara, Gujarat\n💻 Full Stack Developer | UI/UX Enthusiast`,

    about: `Hi, I'm Honey Patel! I build creative full stack apps with Angular, Node.js, and more.`,

    skills: `Languages: JavaScript, Python, Java, C\nFrontend: HTML, CSS, Angular\nBackend: Node.js\nDB: MySQL, MSSQL`,

    contact: `📧 Email: honeypatel4264@gmail.com\n🔗 GitHub: github.com/honeypatel78\n🔗 LinkedIn: linkedin.com/in/honey-patel87/`,

    version: `DevOS Terminal v1.0.0 , Last updated: June 2025`,

    exit:
      `Logging out... ,
      Bye! 👋`,

    clear: 'clear'
  };

  @ViewChild('terminalBody') terminalBody!: ElementRef;

  soundService = inject(SoundService);

  // Terminal function
  handleCommand() {
    const cmd = this.commandInput.trim();
    console.log(cmd);
    this.outputLines.push(`C:\\DevOS\\Desktop> ${cmd}`);

    if (this.commands[cmd]) {
      if (cmd === 'clear') {
        this.outputLines = [];
      } else {
        this.outputLines.push(...this.commands[cmd].split('\n'), `\n`);
      }
    } else {
      this.outputLines.push(`Unknown command: ${cmd}`);
      this.outputLines.push(`Type 'help' to see available commands.\n\n`);
    }

    this.commandInput = '';
    setTimeout(() => {
    this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
    });
  }

  toggleTerminal() {
    this.isTerminal = !this.isTerminal; 
  }

  playsound(){
    this.soundService.playSound();
  }

}
