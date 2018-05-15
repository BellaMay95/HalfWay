/************************************************************************************************************
	Project 2
	Daniel Jimenez
	April 24, 2018
	Instructor: Xuan Guo
	Description: This program simulates the steps from converting logcal addresses to physical addresses.
	Usage: ./a.out BACKING_STORE.bin addresses.txt
************************************************************************************************************/

#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>

//Define statements hold the constants for the program, each self explanatory
#define BUFFER_SIZE 8
//IMPORTANT!!! TLB SIZE IS DEFINED AS 30 AS SPECIFIED IN PROJECT
#define TLB_SIZE 30
#define PAGES 256
#define PAGE_SIZE 256
#define PAGE_MOD 255

//IMPORTANT!!! MEMORY IS DEFINED AS 128 page frames * the page size of 256 AS ASKED FOR IN PROJECT 
#define MEMORY_SIZE 128*256

struct tlb_row
{
	int logicaladd;
	int physicaladd;
};

int main( int argc, char* argv[] ) {

	if (argc < 2) // if statement checks the argument count of the program as the first thing. This allows that if the incorrect number
	{		// of arguments were run, the program is not allowed to run, prints message, and exits. 
		printf("\n\nIncorrect number of args!\n\n\n");
		return 0;
	}
	struct tlb_row tlb[TLB_SIZE], *row;

	int page_table[PAGES], physical_address, logical_page, physical_page, tlb_index;
	signed char phys_memory[MEMORY_SIZE]; //IMPORTANT!!!! PHYSICAL memory is defined as the 128 pages as defined in problem statement by instructor

	if (argc < 2) // if statement checks the argument count of the program as the first thing. This allows that if the incorrect number
	{		// of arguments were run, the program is not allowed to run, prints message, and exits. 
        	printf("\n\nIncorrect number of args!\n\n\n");
        	return 0;
    	}

	// backing_fd is defined as a file descriptor for the binary file. It is immediately opened with the first 
	//argument on the command line, which is BACKING_STORE.bin
	int backing_fd = open(argv[1], O_RDONLY);
	if (&backing_fd == NULL) // if statement checks if there is an issue opening the file at backing_fd, and if so, exits program
	{
		printf("\n\nERROR: problem opening specified file. Program terminating... \n\n\n"); 
		return 0;
	}
        signed char *backing;
	backing = mmap(0, MEMORY_SIZE*2, PROT_READ, MAP_PRIVATE, backing_fd, 0); // system call maps the binary file in backing_fd to memory

	// input_fp is defined as a file descriptor for the addresses file. It is immediately opened with the second argument 
	// on the command line, which is addresses.txt
	FILE* input_fp = fopen(argv[2], "r");
	if (input_fp == NULL) // if statement checks if there is an issue opening the file at input_fp, and if so, exits program
	{
		printf("\n\nERROR: problem opening specified file. Program terminating... \n\n\n"); 
		return 0;
	}

	int i; // declared for all for loops
	//page table is set to all -1, meaning at first, all values in the page table are empty
	for (i = 0; i < PAGES; i++)
	{
		page_table[i] = -1; // sets to -1 for each iteration of pagetable array
	}

	//this while loop is the primary while loop of the program. The program runs while the fgets can still read a like from the input_fp, 
	//for the purpose of the program, each line read in is a new logical address, and then each logical address is operated on within the 
	// while loop and in some cases 

	/**************************************************************
	counters used in program held below*/
	int total_addresses = 0; // coutner for all addresses in program
	int page_faults = 0; // counter for all addresses in program
	int free_page = 0;
	int tlb_hits = 0;

	int found = 0;
        char buffer[BUFFER_SIZE];
	while (fgets(buffer, BUFFER_SIZE, input_fp) != NULL) 
	{
		// logical address read from buffer is translated from text to an integer, and saved in logical_address
		int logical_address = atoi(buffer);
		//the actual page is found by bitshifting 8 in order to seperate the 8 bit page number, and this number is done modulus of 255 to find the exact page
		logical_page = (logical_address >> 8) & PAGE_MOD;
		//physical page is set to -1, currently empty because the physical page has not been yet searched in the TLB
		found = 0;
		physical_page = -1;
		total_addresses++; // with an address read in, this number is incremented to allow for the total addresses ready in from addresses.txt to be increased

		//first for loop searches the entire tlb for a match the current logical page, in order to find the translation to the physical page
		for (i = 0; i < TLB_SIZE; i++) 
		{
			row = &tlb[i % TLB_SIZE];
			if (row->logicaladd == logical_page)
			{
				found = 1;
				physical_page = row->physicaladd;
        		}
		}

        	if (found != 0) //after the previous for loop, if the value is still a -1 for the physical page, meaning the physical page was not found
		{
			tlb_hits++;
        	}
		else
		{
			//doubel checks the physical page from the page table to make sure that the is empty;
			physical_page = page_table[logical_page];

			// if it is empty, in the program using a negative one, then a page fault occurs
			if (physical_page == -1)
			{
				page_faults++; // counter is incremented to show increase in page faults
				if (free_page == 128) // if statement resets freepage to 0 after 128 so that physical memory doesnt go over 128
				{
					free_page = 0;
				}
				physical_page = free_page; // physical page is set to the currently free page. 
                		free_page++; // free page is incrememnted in order for the next page fault to get a new free page
				page_table[logical_page] = physical_page; // the page table is then set to the nect section, which has the physical page

				//memory copy example is taken from the project specification, copies section of backing into main memory
				memcpy(phys_memory + physical_page * PAGE_SIZE, backing + logical_page * PAGE_SIZE, PAGE_SIZE);
			}

			if (tlb_index == 30)
			{
				tlb_index = 0;
			}
			//when the page is added, regardless of page fault or not, it is added to the TLB
			row = &tlb[tlb_index]; // the entry is defined as a tlb page
			row->logicaladd = logical_page; // the logical page is saved as the logical page
			row->physicaladd = physical_page; // the physical page is saved as the physical page
			tlb_index++; // increments the index for the tlb so next entry is in the next section if the tlb
	
		}

		int offset = logical_address & PAGE_MOD; // calculating offset from leftover from mod of logical address
		physical_address = (physical_page << 8) | offset; // physical address is the biteise or of the bitshifted 8 physical page
		int final_value = phys_memory[physical_page * PAGE_SIZE + (logical_address & PAGE_MOD)];

		//print statements run on each iteration of the large while loop and prints the results of each logical-physical-value combo
		printf("Virtual address: %d\tPhysical address: %d\tValue: %d\n", logical_address, physical_address, final_value);
	}

	float pfr =  (float)page_faults/total_addresses; // calculation of page fault rate , both of these cast result to float because of integer math
	float tlbhr = (float)tlb_hits/total_addresses; // calculation of tlb hit rate

	//following are the print statements for final results of program running, printing total addresses, page faults, page fault rate, tlb hits, and the tlh hit rate
	printf("Number of translated addresses : %d\n", total_addresses);
	printf("Page Faults : %d\n", page_faults);
	printf("Page Fault Rate : %f\n", pfr);
	printf("TLB Hits : %d\n", tlb_hits);
	printf("TLB hit rate : %f\n\n\n", tlbhr);

    return 0;
}

